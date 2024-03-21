import { RaceTeams, TeamDefinition, TeamLevel, TeamType } from "./teamdefinition";


export const JNTeams = new RaceTeams();

// PRIMARY Teams

JNTeams.addTeam(new TeamDefinition(
    "COC Coyotes",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        134, // Taya Bilenko
        159, // Logan Burdette
        432, // Lyle Pacem
        447 // Georgii Podkorytov
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "COC WEST",
    undefined,
    TeamLevel.Primary,
    TeamType.Club,
    [
        167, // Yanhua Cao
        342, // Chloe Kim
        400, // Nathaniel Mitchell
        413 // Mia Ngan
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
        545 // Margarita Vagina
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Seattle Country Day School",
    "Seattle Country Day School",
    TeamLevel.Primary,
    TeamType.SchoolOnly,
    [
        241, // Owen Eustis
        277, // Xander Goodman
        347, // Aerin Ko
        530, // Jack Talbot
        577 // Dennis Wu
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
        394 // Amelia Middlebrook
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
        563 // Olivia Wilkinson
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
        374 // Elliott Lyerly
    ]
))

// INTERMEDIATE TEAMS

JNTeams.addTeam(new TeamDefinition(
    "COC Intermediate",
    undefined,
    TeamLevel.Intermediate,
    TeamType.Club,
    [
        133, // Sasha Bilenko
        189, // Allison Coates
        433, // Wyatt Pacem
        456, // Enzo Prinsloo
        464 // Finlay Rebbeck
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "EAS",
    "Environmental & Adventure School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        111, // Adleigh Antonsen
        264, // Calais Gibson
        438, // William Patenaude
        576 // Kathryn Wright
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Mossy Madrona",
    undefined,
    TeamLevel.Intermediate,
    TeamType.Club,
    [
        174, // Susana Castaneda
        225, // Ella Dubail
        224, // Coura Dubail
        255, // Peyton Frost
        360 // Lukas Lee
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Tahoma Blue",
    "Tahoma High School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        199, // Gavin Cooper
        208, // Noah Crosby
        392, // Venna Menzie
        512, // Finley Smith
        572 // Thane Winters
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Tahoma Gold",
    "Tahoma High School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        108, // Gwendolyn Andrus
        476, // Chloe Rodriguez
        571, // Graham Winters
        291 // McClane Harmer
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Washington Middle",
    "Washington Middle School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        306, // Aidan Hopkins
        324, // Levi Johnsen
        436 // Ransom Pardo
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Wolf Squadron Boys",
    "Cedar Heights Middle School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        178, // Jonah Charlie
        235, // Trenton Emerson
        386, // Cole Mausolf
        393, // Evan Michel
        408 // Hunter Naef
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Wolf Squadron Girls",
    "Cedar Heights Middle School",
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        282, // Mia Greseth
        292, // Lydia Hauenstein
        381, // Rilyn Masino
        409, // Nanea Nagatoshi
        468 // Kaidyn Rickard
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Grizzly Intermediate",
    undefined,
    TeamLevel.Intermediate,
    TeamType.Club,
    [
        256, // Kelli Fry
        327, // Titus Johnson
        379 // Jamie Marks
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Troy Yellow 1",
    undefined,
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        179, // Benjamin Cheng
        323, // Evelyn Jiang
        332, // Katherine Jung
        542 // Kaileo Truong
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Troy Yellow 2",
    undefined,
    TeamLevel.Intermediate,
    TeamType.SchoolOnly,
    [
        343, // Jeffrey Kim
        500, // Humza Shahzad
        541 // Luke Tran
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "OCIN Intermediate",
    undefined,
    TeamLevel.Intermediate,
    TeamType.Club,
    [
        206, // Neivayah Creager
        375, // Everett Lyerly
        519 // Logan Starret
    ]
))

// SCHOOL JV TEAMS
JNTeams.addTeam(new TeamDefinition(
    "Arlington Team 1",
    "Arlington High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        181, // Josiah Christoffersen
        102, // Kylie Abbey-Zanni
        325, // Adam Johnson
        350, // Isabelle Kovarik
        417 // Kyleigh Nigh
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Arlington Team 2",
    "Arlington High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        182, // Levi Christoffersen
        266, // Devon Gilstrap
        410, // Caleb Nanez
        452, // Matthew Pollick
        516 // Bryce Southern
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "COC JV",
    undefined,
    TeamLevel.SchoolJrVarsity,
    TeamType.Club,
    [
        270, // Maksym Goncharenko
        330, // Artur Jokela
        426, // Trevor OGorman
        450 // Olga Podkorytova
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Issaquah",
    "Issaquah High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolOnly,
    [
        187, // Alexandra Clarke
        376, // Lilah Malik
        491, // Kira Schell
        522 // Piper Stone
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Kamiak",
    "Kamiak High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolOnly,
    [
        299, // Kyle Hogue
        457, // Inigo Prinsloo
        459 // Jette Prinsloo
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Knights Alpha",
    "Bremerton High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        263, // Victor Gehring
        296, // Nathan Hinds
        444, // Bradley Pickering
        511 // Allison Smith
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Knights Bravo",
    "Bremerton High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        293, // Hailee Henehan
        295, // Avery Herold
        463, // Sean Rascon
        475 // Andre Robinson
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Liberty NJROTC",
    "Liberty high school",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        384, // Oliver Matney
        508, // Fischer Skroch
        497, // Lauren Schwenk
        496 // Conrad Schwenk
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Tahoma JV",
    "Tahoma High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolOnly,
    [
        114, // Lauren Bair
        121, // Hollie Barkley
        321, // Leah Jergensen
        484, // Tucker Rupe
        533 // Lydia Tappana
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "WDTM (We Dropped The Map)",
    "EVERETT HS NJROTC",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        150, // Blake Brooks
        242, // Tristan Fababier
        287, // Saryn Hane
        485, // Isabella Saldana
        269 // Jaeden Gomez
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Wolf Squadron Gamma",
    "South Kitsap High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        177, // Joshua Charley
        210, // Janie Curry
        515 // Karisa Sorensen
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Grizzly Orienteering",
    undefined,
    TeamLevel.SchoolJrVarsity,
    TeamType.Club,
    [
        380, // Miranda Marks
        552, // Joshua Walthall
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "LAOC JV",
    undefined,
    TeamLevel.SchoolJrVarsity,
    TeamType.Club,
    [
        135, // Mikhail Biryukov
        441, // Logan Perez
        443 // Nikita Phillips
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Troy",
    "Troy High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        120, // Raina Ban
        320, // Minjae Jeon
        378, // Tharun Manigandan
        434 // Jason Pan
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "CRLS Falcons JV",
    "Cambridge Rindge & Latin School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolOnly,
    [
        278, // Lucas Goulart
        262, // Nova Gatu Johnson
        329, // Zoey Johnson
        564 // Rolf Willard
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "MHS JROTC Team 1",
    "Midlothian High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        333, // William Kaptchinskie
        482, // Kevin Roman
        517, // Wyatt Sparks
        548 // Leah Villalobos
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "MHS JROTC Team 2",
    "Midlothian High School",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolAndJrotc,
    [
        144, // Kaleb Borcherding
        231, // Olivia Dye
        553, // Thomas Walton
        567 // Zander Williams
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Union County JV",
    "Union County HS",
    TeamLevel.SchoolJrVarsity,
    TeamType.SchoolOnly,
    [
        205, // Aleighla Creager
        207, // Peyton Creager
        274 // Dylan Gonyer
    ]
))

// SCHOOL VARSITY TEAMS

JNTeams.addTeam(new TeamDefinition(
    "Evergreen Orienteering",
    undefined,
    TeamLevel.SchoolVarsity,
    TeamType.Club,
    [
        157, // Danny Buchholz
        316, // Peter Ingalsbe
        477 // David Rogers
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Tahoma Varsity",
    "Tahoma High School",
    TeamLevel.SchoolVarsity,
    TeamType.SchoolOnly,
    [
        198, // Ben Cooper
        364, // Greta Leonard
        483, // Jackson Rupe
        501, // Clara Sherwood
        570 // Bryce Winters
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "The Evergreens",
    undefined,
    TeamLevel.SchoolVarsity,
    TeamType.Club,
    [
        309, // Kyle Hopkins
        313, // Sophie Howes
        557 // TianZheng Wang
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Warhawks",
    "McDonough H.S.",
    TeamLevel.SchoolVarsity,
    TeamType.SchoolAndJrotc,
    [
        191, // Chelsea Colley
        192, // Roman Colley
        216 // Gabriel DeGracia
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Troy",
    "Troy High School",
    TeamLevel.SchoolVarsity,
    TeamType.SchoolAndJrotc,
    [
        258, // Lauren Gao
        302, // Eric Hong
        555, // Freddy Wang
        554, // Annie Wang
        556 // Ostty Wang
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "CRLS Falcons Varsity",
    "Cambridge Rindge & Latin school",
    TeamLevel.SchoolVarsity,
    TeamType.SchoolOnly,
    [
        141, // Riley Bonanno
        585, // Zephyr Newman
        546 // Graham van Bever
    ]
))

// COLLEGE JV TEAMS

JNTeams.addTeam(new TeamDefinition(
    "University of Arizona",
    "University of Arizona",
    TeamLevel.CollegeJrVarsity,
    TeamType.SchoolOnly,
    [
        220, // Christina Dinh
        318, // Shelby Janssen
        211, // Caitlin Cuslidge
    ]
))

// COLLEGE VARSITY TEAMS

JNTeams.addTeam(new TeamDefinition(
    "Clemson Orienteering",
    "Clemson University",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        401, // Alleta Monts
        103, // Lily Addicott
        326, // Ethan Johnson
        521, // Cole Stilwell
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "COC Collegiate Orienteering",
    undefined,
    TeamLevel.CollegeVarsity,
    TeamType.Club,
    [
        397, // Irene Miller
        395, // Annika Mihata
        506, // Zoe Sibthorp
        480, // Kevin Rogers
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Grizzlies",
    "University of Montana",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        146, // Benjamin Brady
        196, // Benjamin Conley
        428, // Calvin Olson
        584, // Zariah Zosel
    ]
))

JNTeams.addTeam(new TeamDefinition(
    "Stanford University",
    "Stanford University",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        470, // Anthony Riley
        294, // Emanuel Herberthson
        471, // Oriana Riley
    ]
))

JNTeams.addTeam(new TeamDefinition(
    "UC San DieGO!",
    "UC San Diego",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        223, // Kai Douglas
        558, // Charles Whitaker
        411, // Sarah Naughten
        505, // Thomas Shi
    ]
))

JNTeams.addTeam(new TeamDefinition(
    "University of Arizona",
    "University of Arizona",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        368, // Billie Lubis
        370, // Cristina Luis
        163, // Anna Campbell
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "USMAOC Black",
    "United States Military Academy",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        453, // Henry Porter
        340, // Reid Kidd
        536, // Collin Thompson
        341, // Gregory Kies
        118, // Hugh Baldwin
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "USMAOC Gold",
    "United States Military Academy",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        153, // Paul Bruce
        383, // Shawn Mather
        354, // Benjamin Lahann
        499, // Siddharth Shah
        568, // Tyler Wilson
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "USMAOC Gray",
    "United States Military Academy",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        534, // Owen Taylor
        520, // Trinity Stenger
        337, // Anthony Keppel
        246, // Josh Fike
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "USMAOC Red",
    "United States Military Academy",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        537, // Joseph Thornhill
        549, // Charlie Wagner
        229, // Owen Dunn
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "USMAOC White",
    "United States Military Academy",
    TeamLevel.CollegeVarsity,
    TeamType.SchoolOnly,
    [
        317, // Bethany Jablon
        139, // Jonathan Blake
        104, // Donovan Allen
        244, // Cade Feddern
    ]
))
JNTeams.addTeam(new TeamDefinition(
    "Washington State Collegiate Orienteering",
    undefined,
    TeamLevel.CollegeVarsity,
    TeamType.Club,
    [
        448, // Vladimir Podkorytov
        183, // Wayan Christoffersen
        122, // Jack Barkley
        390, // Luke Menzie
    ]
))