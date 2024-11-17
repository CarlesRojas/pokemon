import { Item } from "@/game/type/Item";

export interface ItemInfo {
    id: number;
    name: string;
    price: number;
}

export const ItemData: Record<Item, ItemInfo> = {
    [Item.POKE_BALL]: {
        id: 267,
        name: "Poké Ball",
        price: 100,
    },
    [Item.GREAT_BALL]: {
        id: 266,
        name: "Great Ball",
        price: 100,
    },
    [Item.ULTRA_BALL]: {
        id: 265,
        name: "Ultra Ball",
        price: 100,
    },
    [Item.MASTER_BALL]: {
        id: 264,
        name: "Master Ball",
        price: 100,
    },
    [Item.SAFARI_BALL]: {
        id: 268,
        name: "Safari Ball",
        price: 100,
    },
    [Item.FAST_BALL]: {
        id: 281,
        name: "Fast Ball",
        price: 100,
    },
    // [Item.LEVEL_BALL]: {
    //     id: 1,
    //     name: "Level Ball",
    //     price: 100,
    // },
    [Item.LURE_BALL]: {
        id: 283,
        name: "Lure Ball",
        price: 100,
    },
    [Item.HEAVY_BALL]: {
        id: 284,
        name: "Heavy Ball",
        price: 100,
    },
    [Item.LOVE_BALL]: {
        id: 285,
        name: "Love Ball",
        price: 100,
    },
    [Item.FRIEND_BALL]: {
        id: 286,
        name: "Friend Ball",
        price: 100,
    },
    [Item.MOON_BALL]: {
        id: 287,
        name: "Moon Ball",
        price: 100,
    },
    [Item.SPORT_BALL]: {
        id: 269,
        name: "Sport Ball",
        price: 100,
    },
    [Item.NET_BALL]: {
        id: 270,
        name: "Net Ball",
        price: 100,
    },
    [Item.DIVE_BALL]: {
        id: 271,
        name: "Dive Ball",
        price: 100,
    },
    [Item.NEST_BALL]: {
        id: 272,
        name: "Nest Ball",
        price: 100,
    },
    [Item.REPEAT_BALL]: {
        id: 273,
        name: "Repeat Ball",
        price: 100,
    },
    [Item.TIMER_BALL]: {
        id: 274,
        name: "Timer Ball",
        price: 100,
    },
    [Item.LUXURY_BALL]: {
        id: 275,
        name: "Luxury Ball",
        price: 100,
    },
    [Item.PREMIER_BALL]: {
        id: 276,
        name: "Premier Ball",
        price: 100,
    },
    [Item.DUSK_BALL]: {
        id: 277,
        name: "Dusk Ball",
        price: 100,
    },
    [Item.HEAL_BALL]: {
        id: 278,
        name: "Heal Ball",
        price: 100,
    },
    [Item.QUICK_BALL]: {
        id: 279,
        name: "Quick Ball",
        price: 100,
    },
    [Item.CHERISH_BALL]: {
        id: 280,
        name: "Cherish Ball",
        price: 100,
    },
    // [Item.PARK_BALL]: {
    //     id: 1,
    //     name: "Park Ball",
    //     price: 100,
    // },
    // [Item.DREAM_BALL]: {
    //     id: 1,
    //     name: "Dream Ball",
    //     price: 100,
    // },
    // [Item.BEAST_BALL]: {
    //     id: 1,
    //     name: "Beast Ball",
    //     price: 100,
    // },
    // [Item.STRANGE_BALL]: {
    //     id: 1,
    //     name: "Strange Ball",
    //     price: 100,
    // },
};
