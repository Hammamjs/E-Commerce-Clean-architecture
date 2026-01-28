export const SQL = {
 insertRefreshToken: `UPDATE users SET refresh_token = $1 WHERE email = $2`
}