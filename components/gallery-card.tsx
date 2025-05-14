import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

interface GalleryCardProps {
  id?: number
  title: string
  date: string
  thumbnail: string
}

export default function GalleryCard({ id = 1, title, date, thumbnail }: GalleryCardProps) {
  return (
    <Link href={`/galleries/${id}`} className="block group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="font-medium text-lg mb-1 group-hover:text-[#B9FF66] transition-colors">{title}</h3>
      <p className="text-sm text-gray-500">{format(new Date(date), "MMMM d, yyyy")}</p>
    </Link>
  )
}
