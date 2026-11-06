import { type Locale, Locales } from "@libraries/i18n";
import * as t from "drizzle-orm/pg-core";

// public always exists, don't export so it won't be created
export const localeEnum = t.pgEnum("locale", Locales as [Locale, ...Locale[]]);

/**
 * Data Types
 *
 * ------------------------ Global -------------------------
 *
 * Pet
 *  - Name (string)
 *  - Born on (date)
 *  - Species (enum, dog, cat, bird...)
 *  - Breed (string with typed default enum options)
 *  - Behaviors (enum[])
 *  - Died On (date)
 *
 * Vaccination
 *  - Name
 *  - Species
 *
 * Pet Vaccination - Shared across all organizations/owner
 *  - Vaccination (ID)
 *  - Pet (ID)
 *  - Given
 *  - Issued
 *
 * Medicine
 *  - Name
 *  - Image
 *  - Type (solid, liquid...)
 *
 * Pet Medicine - Shared across all organizations/owner
 *  - Medicine (ID)
 *  - Pet (ID)
 *  - Instructions
 *
 * --- This table is what is used when booking to determine if there is anything to flag
 * Interactions - Specific to organization, can be "shared" (copied)
 *  - Organization (ID)
 *  - Pet 1 (ID)
 *  - Pet 2 (ID)
 *  - Type (enum, "friendly", "hostile", "fearful"...)
 *  - Notes
 *  - Owner Visible (boolean) - Should the owner be able to see it
 *
 * ------------------------------ Org/Buisness Specific ------------------------------
 *
 * Client - Connection between a buisness and a customer (possible user in Client_user table)
 *  - Name
 *  - Number
 *
 */
