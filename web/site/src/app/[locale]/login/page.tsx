import Image from 'next/image'
import SideBackground from '@public/dog-hand-up.jpg'
import Wordmark from '@public/wordmark.svg'
import { useLocale, useTranslations } from 'next-intl'
import { LoginClientPage } from './page.client'
import { Link } from '@/features/i18n/navigation'
import { Icon } from '@web/ui'
import { faArrowLeft, faCopyright, faGlobe } from '@web/ui/icons/solid'
import { nativeName } from '@libraries/i18n'
import { Suspense } from 'react'

export default function LoginPage() {
  const t = useTranslations('site.pages.login')
  const locale = useLocale()

  return (
    <main className="flex flex-row-reverse h-screen gap-4 dark:bg-gray-900">
      <section
        id="form"
        className="flex flex-col items-center-safe w-full justify-center-safe gap-2 lg:w-2/3 p-8"
      >
        <div className="max-w-130 flex flex-col justify-center-safe gap-4 grow">
          <Link
            href="/"
            className="font-italic hover:underline focus-visible:outline font-semibold"
          >
            <Icon icon={faArrowLeft} /> {t('back')}
          </Link>
          <h1 className="text-4xl font-bold">{t('title')}</h1>
          <p>
            {t('subtitle') + ' '}
            <Link
              href={'/blog/why-we-have-no-passwords'}
              className="font-italic hover:underline focus-visible:outline font-semibold"
            >
              {t('link')}
            </Link>
          </p>
          <Suspense>
            <LoginClientPage />
          </Suspense>
        </div>
        <footer className="flex justify-between w-full text-sm">
          <span>
            <Icon icon={faCopyright} /> Dogfood Software LLC
          </span>
          <span>
            <Icon icon={faGlobe} /> {nativeName(locale)}
          </span>
        </footer>
      </section>

      <section
        id="cta"
        className="relative hidden lg:flex items-center-safe justify-center-safe grow overflow-hidden"
      >
        <Image
          alt="Cat Raising a Hand"
          src={SideBackground}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 33vw, 0px"
          className="object-cover rtl:-scale-x-100"
          placeholder="blur"
        />

        {/* Overlay content goes here; needs to sit above the image */}
        <div className="relative z-10 h-full w-full grow text-white dark:bg-green-900/80 bg-green-600/80 flex items-center-safe justify-center-safe">
          <Wordmark height={50} className="*:fill-white" />
          {/* <Image src={Wordmark} height={50} alt="JustPets" /> */}
          {/* CTA text */}
        </div>
      </section>
    </main>
  )
}
