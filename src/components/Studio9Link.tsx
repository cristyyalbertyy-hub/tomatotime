import { MEDICAL_SITE_URL } from '../constants'

export function Studio9Link() {
  return (
    <a
      className="studio9-link"
      href={MEDICAL_SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="studio9-link-mark">Studio9</span>
      <span className="studio9-link-sep">·</span>
      <span>Medical Science</span>
    </a>
  )
}
