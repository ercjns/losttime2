import { RaceTeams, TeamDefinition, TeamLevel, TeamType } from "./teamdefinition";


export const JNTeams = new RaceTeams();

// Primary Teams
JNTeams.addTeam(new TeamDefinition(
    "COC Coyotes",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        134, // Taya Bilenko
        159, // Logan Burdette
        432, // Lyle Pacem
        447  // Georgii Podkorytov
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "COC WEST",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        167, // Yanhua Cao
        241, // Owen Eustis
        342, // Chloe Kim
        400, // Nathaniel Mitchell
        413, // Mia Ngan
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Moorlands Elementary",
    "Moorlands Elementary",
    TeamLevel.Primary,
    TeamType.SchoolOnly,
    [
        358, // Mikhail Lavrov
        544, // Kirill Vagin
        545, // Margarita Vagina
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Seattle Country Day School",
    "Seattle Country Day School",
    TeamLevel.Primary,
    TeamType.SchoolOnly,
    [
        277, // Xander Goodman
        347, // Aerin Ko
        464, // Finlay Rebbeck
        530, // Jack Talbot
        577, // Dennis Wu
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Tahoma Bears",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        109, // Peter Andrus
        322, // Nate Jergensen
        394, // Amelia Middlebrook
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Wolf Squadron Charlie",
    "Cedar Heights Middle School",
    TeamLevel.Primary,
    TeamType.SchoolOnly,
    [
        140, // Alaina Boerner
        286, // Khalil Hall
        387, // Kellan McCormick
        473, // Mikaela Rivera
        563, // Olivia Wilkinson
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "OCIN Primary",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        119, // Carter Ballard
        315, // Jamie Hunter
        374, // Elliott Lyerly
    ]
))