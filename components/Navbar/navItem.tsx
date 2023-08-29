import Link from 'next/link'
import ShowIcon from '../svg/showIcon'

type IProps = {
  icon: string
  title: string
  url: string
}
function NavItem({ icon, title, url }: IProps) {
  return (
    <Link href={url} replace
    >
      <div className="group flex  cursor-pointer  flex-row items-center md:hover:scale-125   md:w-12 md:flex-col md:items-center ">
  <div className="nav_img  ml-2 h-8 md:w-8 my-1.5 mr-2 fill-none group-hover:animate-bounce  md:order-none md:mb-1 stroke-lightMainColor dark:stroke-darkMainColor ">
  <ShowIcon  icon={icon} stroke={'2'} />
    </div>
        
        <p className=" tracking-widest mx-3 transition duration-1000 flex-wrap  ease-in-out   group-hover:inline-flex md:block    ">
          {title}
        </p>
      </div>
    </Link>
  )
} 


export default NavItem
