# Comp Results Static App Design

The general idea is that event administrators bring race results in IOF v3 format (the same splits they upload to attackpoint and/or WinSplits) and can create competition results.

What is a competition?
- A stand-alone race
- A multi-day event
- A series

## Workflow

1. Load race results

Load all race results that need to be considered when ranking and scoring. 
This creates many `LtStaticClassResult`s, which are sets of `IOF.PersonResult`s grouped together with the Event, Class, and Course info to which they belong.

2. Define competition classes

In a stand-alone race, the competition classes are often the same as the race classes.
They may be just a sub-set of the race classes




