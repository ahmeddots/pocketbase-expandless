import { Record } from "pocketbase";

// A Record type without the expand property
type RecordExpandless = Omit<Record, "expand">;

// takes in a record or a list of records
// recursivly moves all the properties in the expand property to the record itself
// i.e product.expand.category_id -> product.category_id
// returns a record or a list of records
export function moveExpandsInline(record: Record[] | Record): RecordExpandless {
	// clone record
	let newRecord: RecordExpandless = JSON.parse(JSON.stringify(record));

	// if got an array of records
	if (Array.isArray(newRecord)) {
		// go through each record
		for (let i = 0; i < newRecord.length; i++) {
			console.log("Running in array");
			// run expandRelations on each record
			newRecord[i] = moveExpandsInline(newRecord[i]) as Record;
		}
	}

	// if has no expand, return as is
	if (!("expand" in newRecord)) return newRecord;

	// otherwise go through each relation
	for (const key in newRecord.expand) {
		// set the expand value as a property
		newRecord[key] = newRecord.expand[key];

		// run expandRelations on expanded record to find nested expand record
		newRecord[key] = moveExpandsInline(newRecord[key]) as Record;
	}

	// remove expand field from record
	delete newRecord.expand;

	// return the record in the end
	return newRecord;
}