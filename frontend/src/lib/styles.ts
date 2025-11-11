import { Book, Film, Gamepad2, LucideProps, Tv } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export const categoryIcons: { [key: string]: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> } = {
    game: Gamepad2,
    movie: Film,
    series: Tv,
    book: Book
}

export const categoryGradients: { [key: string]: string } = {
    series: "from-blue-500/10 to-blue-600/10",
    book: "from-emerald-500/10 to-emerald-600/10",
    movie: "from-rose-500/10 to-rose-600/10",
    game: "from-purple-500/10 to-purple-600/10",
}

export const categoryHoverGradients: { [key: string]: string } = {
    series: "hover:from-blue-500/20 hover:to-blue-600/20",
    book: "hover:from-emerald-500/20 hover:to-emerald-600/20",
    movie: "hover:from-rose-500/20 hover:to-rose-600/20",
    game: "hover:from-purple-500/20 hover:to-purple-600/20",
}

export const categoryIconColors: { [key: string]: string } = {
    series: "text-blue-600",
    book: "text-emerald-600",
    movie: "text-rose-600",
    game: "text-purple-600",
}

export const categoryDescriptions: { [key: string]: string } = {
    series: "Explora tu contenido favorito",
    book: "Descubre historias increíbles",
    movie: "Disfruta el mejor cine",
    game: "Juega y diviértete",
}


export const categoryStyles: { [key: string]: string } = {
    game: "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
    movie: "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200",
    series: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
    book: "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200",
}

export const categoryBorderGlow: { [key: string]: string } = {
    game: "shadow-[0_0_20px_rgba(147,51,234,0.5)] border-purple-500",
    movie: "shadow-[0_0_20px_rgba(244,63,94,0.5)] border-rose-500",
    series: "shadow-[0_0_20px_rgba(59,130,246,0.5)] border-blue-500",
    book: "shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-500",
}

export const categoryBorderColors: { [key: string]: string } = {
    game: "border-purple-500/50",
    movie: "border-rose-500/50",
    series: "border-blue-500/50",
    book: "border-emerald-500/50",
}