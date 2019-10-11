# EndnoteToZotero

## The Backstory

I needed to import entries from https://digitalcommons.georgefox.edu/icctej/ into a Zotero collection.

Probably could have written a translator but I realised that this site could supposedly do a "Bibliography Export". The problem was that the export looked like this (and it was downloaded as `search_results-refer.txt`):

```
%T Exploring Care in Education
%0 Journal Article
%A Schat, Sean
%B International Christian Community of Teacher Educators Journal
%D 2018
```

This appears to be an Endnote (enl?) format.

Surely this can be converted to a Zotero xml file... Yes, indeed.

## Usage

```
node main.js search_results-refer.txt to_import.xml
```

## Disclaimer

This worked for my narrow use case, you'll have to modify it to do anything more than journal articles with specific fields. I got sick of looking too carefully at what data was supposed to be there so use at your own risk. THIS ONLY GENERATES JOURNAL ARTICLE XML.
