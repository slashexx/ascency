import { NextResponse } from "next/server";

export async function POST(request: Request){
    const data = await request.json();
    const {markdown} = data;
    function parseMarkdownToJSON(markdown: string) {
      const sections = markdown.split(/###\s\*\*(.*?)\*\*/g).filter(Boolean);
      const json = [];
    
      for (let i = 2; i < sections.length; i += 2) {
        const title = sections[i].trim();
        const table = sections[i + 3];
        const rows = table
          .split("\n")
          .filter(row => row.trim() && !row.startsWith("| ---"))
          .map(row => row.split("|"))
          .filter(row => row.length > 3)
          .map(cells => cells.map(cell => cell.trim()));
    
        if (rows.length > 3) {
          const headers = rows[2].slice(1, -1); // Skip first and last empty columns
          const data = rows.slice(3).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
            // @ts-expect-error nothing to see here
              obj[header] = row[index + 3]; // Skip first empty column
            });
            return obj;
          });
    
          json.push({
            title,
            data
          });
        }
      }
    
      return json;
    }
    
    const result = parseMarkdownToJSON(markdown);
    console.log(JSON.stringify(result, null, 4));
    return NextResponse.json(result);
    
}

