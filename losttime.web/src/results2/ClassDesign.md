Making notes for refactoring so that `CompetitionClass` items actually inherit.

ExtractResults()
XML3 ResultsList File -> StandardRaceData, StandardRaceClassData
CSV File -> StandardRaceData, StandardRaceClassData
CSV File -> ScoreRaceData, ScoreRaceClassData

CreateCompetitionClass()
StandardRaceResult[], scoring properties -> CompetitionClass

`CompetitionClass`
this has all the data needed for assigning points and positions
this has a compute() method which takes this data and creates a  `ComputedCompetitionClass`

CompetitionClass.compute()
CompetitionClass -> ComputedCompetitionClass

`ComputedCompetitionClass` 
this has all the data needed to display
this is where renderers are defined for this specific kind of result
NO calculations going on here, this is just rendering.

ComputedCompetitionClass.render()
ComputedCompetitionClass, style -> text/html content



1. CompetitionClass
  - ID: Guid
  - Name: String
  - ContributingResults: LtStaticRaceClassResult[]
  - ConsideredResults: LtStaticRaceClassResult[] | null
  - Compute() -> ComputedCompetitionClass
1. ComputedCompetitionClass
  - CreatedAt: Timestamp
  - Results: (idea is I can call this a <Result> array, but really it's some kind of child of <Result>)


1. SingleRaceSoloResult
    - Raw: XmlPersonResult
    - Name: string
    - Club: string
    - Time: number
    - Place: number | null
    - CourseCompletionStatus
    - CompetitiveStatus
    1. SingleRaceSoloPointedResult
        - Points: number | null
1. SingleRaceTeamResult
    1. SingleRaceTeamCocWiolResult
    1. SingleRaceTeamOusaJnResult
1. ManyRaceSoloResult
1. ManyRaceTeamResult