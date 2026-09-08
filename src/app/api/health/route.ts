export async function GET() {
  return Response.json({
    ok: true,
    service: "wisconsin-exam-coach",
    phase: 1,
  });
}
