import MemberCard from './MemberCard'

export interface MemberProps {
	avatarSrc: string
	name: string
	role: string[]
}

export interface MemberCardProps {
	member: MemberProps
}

export { MemberCard }
