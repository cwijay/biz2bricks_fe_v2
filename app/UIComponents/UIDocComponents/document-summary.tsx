import { document } from "@/app/UILibraries/definitions";
export default function DocumentSummary({ doc }: {
    doc: document
}) {
    return (
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                    Document Summary for:{doc.name}
                </label>

            </div>

            
        </div>
    );

}