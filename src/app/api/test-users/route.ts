import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    const testUsers = await prisma.testUser.findMany({
      where: {
        organizationId: orgId,
      },
      include: {
        checkedOutBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(testUsers);
  } catch (error) {
    console.error("Error fetching test users:", error);
    return NextResponse.json(
      { error: "Failed to fetch test users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, organizationId } =
      await request.json();

    if (!firstName || !lastName || !email || !password || !organizationId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const testUser = await prisma.testUser.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        organizationId,
      },
    });

    return NextResponse.json(testUser);
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { error: "Failed to create test user" },
      { status: 500 }
    );
  }
}
