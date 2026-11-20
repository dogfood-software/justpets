import type { CollectionConfig } from 'payload'
import { authenticated } from '@/features/content/access/authenticated'
import { betterAuthStrategy } from '../access/strategy'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // We use a single Auth system in @backend/api
    disableLocalStrategy: true,
    strategies: [betterAuthStrategy],
  },
  access: {
    admin: authenticated,
    create: () => false, // synced from Better-Auth
    delete: authenticated,
    read: authenticated,
    update: () => false, // synced from Better-Auth
  },
  admin: {
    defaultColumns: ['email', 'name', 'locale'],
    disableCopyToLocale: true,
    hidden: true,
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'userId',
      required: true,
      type: 'text',
      unique: true,
      admin: { hidden: true, readOnly: true },
      localized: false,
    },
    {
      admin: { readOnly: true },
      name: 'email',
      required: true,
      type: 'text',
      unique: true,
      localized: false,
    },
    {
      admin: { readOnly: true },
      name: 'name',
      type: 'text',
      localized: false,
    },
    {
      admin: { readOnly: true },
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      localized: false,
    },
  ],
  timestamps: true,
  versions: false,
}
