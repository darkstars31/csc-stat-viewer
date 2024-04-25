
export type ExtendedStats = {
    name: string,
    trackedObj: TrackedObj,
    hitboxTags: HitboxTags,
    weaponKills: WeaponKills
}

export type TrackedObj = {
    weaponInspects: number,
    chickenKills: number,
    noScopesKills: number,
    wallBangKills: number,
    throughSmokeKills: number,
    isBlindedKills: number,
    airborneKills: number,
    bombsPlanted: number,
    bombsDefused: number,
    crosshairShareCode: string,
    mvpCount: number,
}

export type WeaponKills = {
    World?: number,
    'USP-S'?: number,
    'HE Grenade'?: number,
    MP9?: number,
    M4A1?: number,
}

export type HitboxTags = {
    Generic: number,
    Head: number,
    Chest: number,
    Stomach: number,
    LeftArm: number,
    RightArm: number,
    LeftLeg: number,
    RightLeg: number,
    Neck: number,
}