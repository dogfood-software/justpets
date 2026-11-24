import Image from 'next/image'
import './styles.css'

export default async function HomePage() {
  return (
    <div className="content-center w-screen h-screen text-center">
      <main>
        <picture className="inline-block">
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>
        <h1>Work in Progress</h1>
      </main>
    </div>
  )
}
