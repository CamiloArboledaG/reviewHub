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
    series: "Comparte tu opinión sobre series",
    book: "Reseña tus libros favoritos",
    movie: "Comparte tu opinión sobre películas",
    game: "Reseña tus juegos favoritos",
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

export const categorySuggestButtonColors: { [key: string]: {
    border: string;
    bg: string;
    iconBg: string;
    iconBgHover: string;
    text: string;
    textHover: string;
    subtext: string;
    subtextHover: string;
} } = {
    game: {
        border: "hover:border-purple-400",
        bg: "hover:bg-purple-50",
        iconBg: "bg-purple-100",
        iconBgHover: "group-hover:bg-purple-200",
        text: "text-purple-600",
        textHover: "group-hover:text-purple-600",
        subtext: "text-gray-500",
        subtextHover: "group-hover:text-purple-500"
    },
    movie: {
        border: "hover:border-rose-400",
        bg: "hover:bg-rose-50",
        iconBg: "bg-rose-100",
        iconBgHover: "group-hover:bg-rose-200",
        text: "text-rose-600",
        textHover: "group-hover:text-rose-600",
        subtext: "text-gray-500",
        subtextHover: "group-hover:text-rose-500"
    },
    series: {
        border: "hover:border-blue-400",
        bg: "hover:bg-blue-50",
        iconBg: "bg-blue-100",
        iconBgHover: "group-hover:bg-blue-200",
        text: "text-blue-600",
        textHover: "group-hover:text-blue-600",
        subtext: "text-gray-500",
        subtextHover: "group-hover:text-blue-500"
    },
    book: {
        border: "hover:border-emerald-400",
        bg: "hover:bg-emerald-50",
        iconBg: "bg-emerald-100",
        iconBgHover: "group-hover:bg-emerald-200",
        text: "text-emerald-600",
        textHover: "group-hover:text-emerald-600",
        subtext: "text-gray-500",
        subtextHover: "group-hover:text-emerald-500"
    }
}

export const categoryReviewFormColors: { [key: string]: {
    cardBg: string;
    cardBorder: string;
    iconBg: string;
    iconColor: string;
    badge: string;
    badgeText: string;
    inputFocusRing: string;
    inputFocusBorder: string;
    buttonGradient: string;
    buttonHoverGradient: string;
} } = {
    game: {
        cardBg: "bg-purple-50/50",
        cardBorder: "border-purple-100",
        iconBg: "bg-purple-500",
        iconColor: "text-white",
        badge: "bg-purple-100",
        badgeText: "text-purple-700",
        inputFocusRing: "focus:ring-purple-500",
        inputFocusBorder: "focus:border-purple-500",
        buttonGradient: "bg-gradient-to-r from-purple-600 to-purple-700",
        buttonHoverGradient: "hover:from-purple-700 hover:to-purple-800"
    },
    movie: {
        cardBg: "bg-rose-50/50",
        cardBorder: "border-rose-100",
        iconBg: "bg-rose-500",
        iconColor: "text-white",
        badge: "bg-rose-100",
        badgeText: "text-rose-700",
        inputFocusRing: "focus:ring-rose-500",
        inputFocusBorder: "focus:border-rose-500",
        buttonGradient: "bg-gradient-to-r from-rose-600 to-rose-700",
        buttonHoverGradient: "hover:from-rose-700 hover:to-rose-800"
    },
    series: {
        cardBg: "bg-blue-50/50",
        cardBorder: "border-blue-100",
        iconBg: "bg-blue-500",
        iconColor: "text-white",
        badge: "bg-blue-100",
        badgeText: "text-blue-700",
        inputFocusRing: "focus:ring-blue-500",
        inputFocusBorder: "focus:border-blue-500",
        buttonGradient: "bg-gradient-to-r from-blue-600 to-blue-700",
        buttonHoverGradient: "hover:from-blue-700 hover:to-blue-800"
    },
    book: {
        cardBg: "bg-emerald-50/50",
        cardBorder: "border-emerald-100",
        iconBg: "bg-emerald-500",
        iconColor: "text-white",
        badge: "bg-emerald-100",
        badgeText: "text-emerald-700",
        inputFocusRing: "focus:ring-emerald-500",
        inputFocusBorder: "focus:border-emerald-500",
        buttonGradient: "bg-gradient-to-r from-emerald-600 to-emerald-700",
        buttonHoverGradient: "hover:from-emerald-700 hover:to-emerald-800"
    }
}