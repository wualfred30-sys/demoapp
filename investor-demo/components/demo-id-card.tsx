import { InvestorDemoProfile, formatAddress, getResidentCode } from "@/lib/demo-storage"

export function DemoIdCard({ profile }: { profile: InvestorDemoProfile }) {
  return (
    <div className="id-card">
      <div className="id-card__accent" />

      <div className="id-card__header">
        <div>
          <p className="id-card__eyebrow">{profile.barangay || "Barangay Demo"}</p>
          <h3>Resident Digital ID</h3>
        </div>
        <div className="id-card__seal">BL</div>
      </div>

      <div className="id-card__body">
        <div className="id-card__photo">
          {profile.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoDataUrl} alt={profile.fullName} className="id-card__photo-image" />
          ) : (
            <span>{profile.fullName.charAt(0).toUpperCase() || "R"}</span>
          )}
        </div>

        <div className="id-card__identity">
          <p className="id-card__name">{profile.fullName || "Resident Name"}</p>
          <p className="id-card__address">{formatAddress(profile) || "Address will appear here"}</p>
          <div className="id-card__meta">
            <div>
              <span>Mobile</span>
              <strong>{profile.mobileNumber || "-"}</strong>
            </div>
            <div>
              <span>Occupation</span>
              <strong>{profile.occupation || "-"}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="id-card__footer">
        <div>
          <span>Resident Code</span>
          <strong>{getResidentCode(profile)}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{profile.email || "-"}</strong>
        </div>
      </div>
    </div>
  )
}
