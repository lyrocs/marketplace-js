// { "total": 59, "perPage": 20, "currentPage": 1, "lastPage": 3, "firstPage": 1, "firstPageUrl": "/?page=1", "lastPageUrl": "/?page=3", "nextPageUrl": "/?page=2", "previousPageUrl": null }

import { BaseModelDto } from '@adocasts.com/dto/base'

export default class MetaDto extends BaseModelDto {
  declare total: number
  declare perPage: number
  declare currentPage: number
  declare lastPage: number
  declare firstPage: number
  declare firstPageUrl: string
  declare lastPageUrl: string
  declare nextPageUrl: string
  declare previousPageUrl: string

  constructor(meta?: any) {
    super()

    if (!meta) return
    this.total = meta.total
    this.perPage = meta.perPage
    this.currentPage = meta.currentPage
    this.lastPage = meta.lastPage
    this.firstPage = meta.firstPage
    this.firstPageUrl = meta.firstPageUrl
    this.lastPageUrl = meta.lastPageUrl
    this.nextPageUrl = meta.nextPageUrl
    this.previousPageUrl = meta.previousPageUrl
  }
}