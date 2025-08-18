import * as sdk from 'matrix-js-sdk'
import env from '#start/env'
import { MatrixContractService } from '#contracts/matrix_service'

export class MatrixService implements MatrixContractService {
  client: sdk.MatrixClient | null = null
  accessToken: string | null = null
  async init() {
    const response = await fetch('https://matrix.lyrocs.ovh/_matrix/client/v3/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'm.login.password',
        user: env.get('MATRIX_USER'),
        password: env.get('MATRIX_PASSWORD'),
      }),
    })

    const data: any = await response.json()
    const accessToken = data?.access_token || ''
    const userId = data?.user_id || ''
    this.client = sdk.createClient({
      baseUrl: 'https://matrix.lyrocs.ovh',
      accessToken: accessToken,
      userId: userId,
    })
    this.accessToken = accessToken
  }
  async start() {
    if (this.client) {
      console.log('Client already initialized')
    }
    if (!this.client) {
      await this.init()
    }
    this.client?.startClient()

    this.client.on(sdk.RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
      if (toStartOfTimeline) {
        return // don't print paginated results
      }
      if (event.getType() !== 'm.room.message') {
        return // only print messages
      }
      const age = (event as any).event?.unsigned?.age
      if (age < 5000) {
        const body = event.getContent().body
        if (body?.startsWith('!hello')) {
          this.client.sendEvent(room.roomId, sdk.EventType.RoomMessage, {
            body: 'Hello, world!',
            msgtype: sdk.MsgType.Text,
          })
        }
        if (body?.startsWith('!create')) {
          fetch('https://matrix.lyrocs.ovh/_synapse/admin/v2/users/%40test5%3Amatrix.lyrocs.ovh', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.accessToken}`,
            },
            body: JSON.stringify({
              admin: false,
              id: 'test5',
              displayname: 'test5',
              password: 'test5',
            }),
          })
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              console.log('Login response: %s', JSON.stringify(data))
            })
        }
      }
    })
  }
  async createUser() {
    // generate random username and password
    const randomString = (length: number) => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    const username = randomString(16)
    const password = randomString(16)
    const fullUsername = `@${username}:matrix.lyrocs.ovh`
    const encodedUsername = encodeURIComponent(fullUsername)
    const response = await fetch(
      `https://matrix.lyrocs.ovh/_synapse/admin/v2/users/${encodedUsername}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          password,
          admin: false,
          displayname: username,
        }),
      }
    )
    if (response.ok) {
      return { username: fullUsername, password }
    } else {
      console.error('Error creating user:', response.statusText)
      const data = await response.json()
      console.error('Error details:', data)
      return null
    }
  }

  // email:
  async createRoom({
    name,
    sellerName,
    buyerName,
  }: {
    name: string
    sellerName: string
    buyerName: string
  }) {
    const response = await this.client?.createRoom({
      visibility: 'private', // or "public"
      name,
      topic: name,
      invite: [sellerName, buyerName], // optional
      preset: 'private_chat', // or "public_chat"
      is_direct: false, // set true if it's a direct chat
    })
    return response.room_id
  }
}
