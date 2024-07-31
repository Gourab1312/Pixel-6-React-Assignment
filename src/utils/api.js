const API_BASE_URL = 'https://lab.pixel6.co/api';

export async function verifyPAN(panNumber) {
  const response = await fetch(`${API_BASE_URL}/verify-pan.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ panNumber }),
  });
  return response.json();
}

export async function getPostcodeDetails(postcode) {
  const response = await fetch(`${API_BASE_URL}/get-postcode-details.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postcode }),
  });
  return response.json();
}