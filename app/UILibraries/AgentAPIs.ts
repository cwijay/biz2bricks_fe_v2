// Delete a document from Firestore



const BASE_URL = 'http://127.0.0.1:5000';

export async function firestoreInsert(document: any) {
  const response = await fetch(`${BASE_URL}/firestore/insert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document })
  });
  if (!response.ok) {
    throw new Error(`Error inserting document: ${response.statusText}`);
  }
  return response.json();
}

export async function firestoreSelect(Org_Id: string, Agent_Id: string) {
  const response = await fetch(`${BASE_URL}/firestore/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Org_Id, Agent_Id })
  });
  if (!response.ok) {
    throw new Error(`Error selecting document: ${response.statusText}`);
  }
  return response.json();
}

export async function populateExcel(Org_Id: string, Agent_Id: string, file_name: string) {
  const response = await fetch(`${BASE_URL}/populate_excel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Org_Id, Agent_Id, file_name })
  });
  if (!response.ok) {
    throw new Error(`Error populating Excel: ${response.statusText}`);
  }
  return response.json();
}
// List documents from Firestore
export async function firestoreList(Org_Id: string) {
  const response = await fetch(`${BASE_URL}/firestore/getAgentsList`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Org_Id })
  });
  if (!response.ok) {
    throw new Error(`Error listing documents: ${response.statusText}`);
  }
  return response.json();
}