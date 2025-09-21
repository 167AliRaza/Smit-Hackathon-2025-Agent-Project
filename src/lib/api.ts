const BASE_URL = "https://167aliraza-campus-agent.hf.space";

interface ChatRequest {
  query: string;
}

interface ChatResponse {
  response: string;
}

interface StudentStatistics {
  summary: {
    total_students: number;
  };
  department_statistics: {
    students_by_department: {
      [key: string]: number;
    };
  };
  recent_students: {
    recent_students: Array<{
      name: string;
      student_id: number;
      department: string;
      email: string;
      onboarded_at: string;
    }>;
  };
}

export async function chatAgent(query: string): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function chatAgentStream(
  query: string,
  onDelta: (delta: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    const response = await fetch(`${BASE_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.substring(0, newlineIndex).trim();
        buffer = buffer.substring(newlineIndex + 1);

        if (line.startsWith("data:")) {
          try {
            const jsonString = line.substring(5).trim();
            const data = JSON.parse(jsonString);
            if (data.type === "delta" && data.delta) {
              onDelta(data.delta);
            }
          } catch (e) {
            console.error("Error parsing JSON from stream:", e, "Line:", line);
          }
        }
      }
    }
    onComplete();
  } catch (error) {
    console.error("Streaming chat error:", error);
    onError(error as Error);
  }
}

export async function getStudentStatistics(): Promise<StudentStatistics> {
  const response = await fetch(`${BASE_URL}/analytics/student-statistics`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}