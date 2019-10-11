const fs = require("fs")
const filename = process.argv[2]
const outfile = process.argv[3]
console.log("Trying to process:", filename)
const file_lines = fs.readFileSync(filename, "utf-8").split("\n")
file_lines.push("") //ensure that we end on a blank line

const field_mappings = {
	"%T": "title",
	"%0": "item_type",
	"%A": "author", //array
	"%B": "publication",
	"%D": "year",
	"%8": "publication_date",
	"%V": "volume",
	"%N": "number",
	"%U": "url",
	"%X": "abstract" //can be multiline...
}

const entries = []
let entry = {}
file_lines.forEach(line => {
	if (line.trim().length == 0) {
		if (Object.keys(entry).length > 0) {
			entries.push(entry)
			entry = {}
		}
		return
	}
	const field = line.substring(0,2)
	const value = line.substring(3)

	if (field === "%A") {
		if (!("authors" in entry)) {
			entry["authors"] = []
		}
		entry.authors.push(value)
	}
	else if (field === "%X") {
		const escaped_value = value.replace(/\&/g, "&amp;")
		if (entry.abstract) {
			entry.abstract += "\n" + escaped_value
		}
		else {
			entry.abstract = escaped_value
		}
	}
	else {
		if (!(field in field_mappings)) {
			console.log("Error: doesn't support:", field)
			console.log(line)
			console.log(entry)
			process.exit()
		}
		if (entry[field_mappings[field]] && entry[field_mappings[field]].length > 0) {
			console.log("Error: should not have content in field:", field)
			console.log(line)
			console.log(entry)
			process.exit()
		}
		entry[field_mappings[field]] = value
	}
})

const generate_record_xml = (e) => `
<record>
<database name="MyLibrary">MyLibrary</database><source-app name="Zotero">Zotero</source-app>
	<ref-type name="Journal Article">17</ref-type>
    ${e.authors ? `<contributors>
		<authors>
		${e.authors.map(author => `<author>${author}</author>`).join("\n")}
		</authors>
	</contributors>` : ""}
    ${(e.title || e.publication) ? `<titles>
		${e.title ? `<title>${e.title}</title>` : ""}
		${e.publication ? `<secondary-title>${e.publication}</secondary-title>` : ""}
	</titles>` : ""}
    ${e.publication ? `<periodical>
        <full-title>${e.publication}</full-title>
	</periodical>` : ""}
	${e.volume ? `<volume>${e.volume}</volume>` : ""}
	${e.number ? `<number>${e.number}</number>` : ""}
	${e.number ? `<issue>${e.number}</issue>` : ""}
    ${(e.year || e.publication_date) ? `<dates>
		${e.year ? `<year>${e.year}</year>` : ""}
        ${e.publication_date ? `<pub-dates>
            <date>${e.publication_date}</date>
		</pub-dates>` : ""}
	</dates>` : ""}
	${e.abstract ? `<abstract>${e.abstract}</abstract>` : ""}
    ${e.url ? `<urls>
        <web-urls>
			<url>${e.url}</url>
        </web-urls>
	</urls>` : ""}
</record>
`


const records = entries.map(generate_record_xml)

const full_xml = `<?xml version="1.0" encoding="UTF-8"?>
<xml><records>
${records.join("\n")}
</records></xml>`

fs.writeFileSync(outfile, full_xml, "utf8")
