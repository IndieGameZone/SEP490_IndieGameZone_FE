export const MAX_DONATION = 500_000;
export const MAX_GAME_PRICE = 1_000_000;

export const GAME_REALEASE_STATUS = [
    {
        label: "Released",
        value: "Released",
        description: "Project is complete, but might receive some updates",
    },
    {
        label: "In Development",
        value: "InDevelopment",
        description: "Project is in active developerment (or in early access)",
    },
    {
        label: "On Hold",
        value: "OnHold",
        description: "Development is paused for now",
    },
    {
        label: "Canceled",
        value: "Canceled",
        description: "Development has stopped indefinitely",
    },
    {
        label: "Prototype",
        value: "Prototype",
        description:
            "An early prototype for testing an idea out, fate of the project unknown",
    },
]

export const GAME_VISIBILITY_STATUS = [
    {
        label: "Draft",
        value: "Draft",
        description: "Only those who can edit the project can view the page",
    },
    {
        label: "Restricted",
        value: "Restricted",
        description: "Only owners & authorized people can view the page",
    },
    {
        label: "Public",
        value: "Public",
        description: "Anyone can view the page",
    },
]