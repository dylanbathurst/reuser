export interface User {
  id: string;
  email: string;
  organizationId: string;
}

export async function getSession(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/session", {
      cache: "no-store",
    });
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Login failed" };
    }

    return { user: data.user };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login" };
  }
}

export async function signup(
  email: string,
  password: string,
  organizationId: string
): Promise<{ user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, organizationId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Signup failed" };
    }

    return { user: data.user };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Failed to create account" };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}
