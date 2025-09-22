interface CardCategoryProps {
  title: string
  description: string
  image: string
}

export default function CardCategory({ title, description, image }: CardCategoryProps) {
  return (
    <div
      className="bg-white rounded-full shadow-lg flex flex-col items-center text-center px-6 py-10 h-full
                 transition-all duration-300 hover:bg-green-200 hover:shadow-xl cursor-pointer"
    >
      <div className="w-24 h-24 flex items-center justify-center mb-4">
        <img
          src={image}
          alt={title}
          className="w-20 h-20 object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}