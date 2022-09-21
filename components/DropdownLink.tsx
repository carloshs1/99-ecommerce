import Link from 'next/link'

const DropdownLink = (props: {
 href: string
 children: string
 className: string
}) => {
 let { href, children, ...rest } = props
 return (
  <Link href={href}>
   <a {...rest}>{children}</a>
  </Link>
 )
}

export default DropdownLink
