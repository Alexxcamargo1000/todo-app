import { Category } from '@prisma/client'
import { UserButton } from '../UserButton'
import { Desktop } from './Desktop'
import { Mobile } from './Mobile'

export interface AsideProps {
  categories: Array<Category>
  setCurrentCategory: (categoryId: string) => void
}

export async function Aside() {
  return (
    <>
      <div className="fixed top-6 left-6 hidden max-lg:block">
        <UserButton />
      </div>
      <Desktop />
      <Mobile />
    </>
  )
}
