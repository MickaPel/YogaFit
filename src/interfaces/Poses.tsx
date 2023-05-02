export interface PosesData {
    id: number
    english_name: string
    sanskrit_name_adapted: string
    sanskrit_name: string
    translation_name: string
    pose_description: string
    pose_benefits: string
    url_svg: string
    url_png: string
    url_svg_alt: string,
}

export interface UserProgramInfos {
    name: string,
    poses: {
        name?: string;
        description?: string;
        time: string;
        image?: string;
        id?: string;
    }[]
}

export interface UserProgramNames {
    name: string,
    id: string
}