
export type ExtendedStats = {
    name: string,
    crosshairShareCode: string,
    chickens: chickens,
    trackedObj: TrackedObj,
    hitboxTags: HitboxTags,
    weaponKillSubTypes: WeaponKillSubTypes,
    weaponKills: Partial<WeaponKills>
}

export type chickens = {
	"killed": number,
    "roasted": number,
    "exploded": number,
    "shot": number,
    "stabbed": number,
}

export type TrackedObj = {
    //weaponInspects: number,
    noScopesKills: number,
    wallBangKills: number,
    smokeKills: number,
    blindedKills: number,
    airborneKills: number,
    bombsPlanted: number,
    bombsDefused: number,
    diedToBomb: 0,
	ninjaDefuses: 0,
    mvpCount: number,
}

export type WeaponKillSubTypes = {
    melee: number,
    rifle: number,
    smg: number,
    sniper: number,
    shotgun: number,
    pistol: number,
    grenade: number,
};

export type WeaponKills = {
    World: number,
    'USP-S': number,
    'HE Grenade': number,
    MP9: number,
    M4A1: number,
    P250: number,
    'AK-47': number,
    'Glock-18': number,
    'Tec-9': number,
    'Galil AR': number,
    MP7: number,
    'R8 Revolver': number,
    XM1014: number,
    M4A4: number,
    'MAC-10': number,
    P2000: number,
    FAMAS: number,
    Knife: number,
    AWP: number,
    'SSG 08': number,
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