import Image from 'next/image'
import SideBackground from '@public/dog-hand-up.jpg'
import Wordmark from '@public/wordmark.svg'

export default function LoginPage() {
  return (
    <main className="flex flex-row-reverse h-screen">
      <section
        id="form"
        className="flex flex-col items-center-safe w-full justify-center-safe gap-4 lg:w-1/2"
      >
        <Image src={Wordmark} height={25} alt="JustPets" />
        <h1 className="text-4xl">Welcome!</h1>
        {/* form */}
      </section>

      <section
        id="cta"
        className="relative hidden lg:flex items-center-safe justify-center-safe grow overflow-hidden text-white"
      >
        <Image
          alt="Cat Raising a Hand"
          src={SideBackground}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 33vw, 0px"
          className="object-cover brightness-50"
          placeholder="blur"
        />

        {/* Overlay content goes here; needs to sit above the image */}
        <div className="relative z-10">{/* CTA text */}</div>
      </section>
    </main>
  )
}
