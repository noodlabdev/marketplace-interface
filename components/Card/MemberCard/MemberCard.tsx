import Image from 'next/image'
import Link from 'next/link'

import { MemberCardProps } from '.'
import { AvatarWrap, MemberCardWrap } from './MemberCard.styled'

function MemberCard({ member }: MemberCardProps) {
	console.log(member.role)
	return (
		<MemberCardWrap>
			<AvatarWrap>
				<Image
					priority
					src={member.avatarSrc}
					alt="Logo"
					layout="fill"
					objectFit="contain"
					objectPosition="center center"
				/>
			</AvatarWrap>
			<div className="member-name">
				<h3>{member.name}</h3>
			</div>
			<ul className="member-role">
				{member.role.map((r, i) => (
					<li key={i}>- {r}</li>
				))}
			</ul>
		</MemberCardWrap>
	)
}

export default MemberCard
