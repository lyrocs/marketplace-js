import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { UserService } from '#services/user_service'
import UserDto from '#dtos/user'
import { updateProfileValidator } from '#validators/profile'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'

@inject()
export default class ProfileController {
  constructor(private userService: UserService) {}

  /**
   * Afficher la page de profil de l'utilisateur connecté
   */
  async show({ inertia, auth, request }: HttpContext) {
    const user = auth.getUserOrFail()
    return inertia.render('profile/show', { 
      user: new UserDto(user),
      csrfToken: request.csrfToken
    })
  }

  /**
   * Mettre à jour les informations du profil utilisateur
   */
  async update({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const data = await request.validateUsing(updateProfileValidator)
    
    await this.userService.update(user.id, {
      name: data.name,
      email: data.email,
    })

    return response.redirect().back()
  }

  /**
   * Uploader une nouvelle image de profil
   */
  async uploadImage({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp']
    })

    if (!image) {
      return response.badRequest({ message: 'Aucune image fournie' })
    }

    if (!image.isValid) {
      return response.badRequest({ 
        message: 'Image invalide',
        errors: image.errors 
      })
    }

    try {
      // Générer un nom unique pour l'image
      const key = `profile_images/${cuid()}.${image.extname}`
      
      // Uploader vers S3
      await image.moveToDisk(key)
      
      // Obtenir l'URL de l'image
      const imageUrl = await drive.use().getUrl(key)
      
      // Supprimer l'ancienne image si elle existe
      if (user.image && user.image.includes('amazonaws.com')) {
        const oldKey = user.image.split('amazonaws.com/').pop()
        if (oldKey) {
          try {
            await drive.use().delete(oldKey)
          } catch (error) {
            console.warn('Impossible de supprimer l\'ancienne image:', error)
          }
        }
      }
      
      // Mettre à jour le profil utilisateur
      await this.userService.update(user.id, { image: imageUrl })
      
      return response.json({ 
        success: true, 
        imageUrl,
        message: 'Image de profil mise à jour avec succès'
      })
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error)
      return response.internalServerError({ 
        message: 'Erreur lors de l\'upload de l\'image' 
      })
    }
  }

  /**
   * Supprimer l'image de profil
   */
  async removeImage({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    
    if (user.image && user.image.includes('amazonaws.com')) {
      const key = user.image.split('amazonaws.com/').pop()
      if (key) {
        try {
          await drive.use().delete(key)
        } catch (error) {
          console.warn('Impossible de supprimer l\'image:', error)
        }
      }
    }
    
    await this.userService.update(user.id, { image: null })
    
    return response.json({ 
      success: true, 
      message: 'Image de profil supprimée avec succès' 
    })
  }
}
