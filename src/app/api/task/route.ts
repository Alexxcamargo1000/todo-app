/* eslint-disable @typescript-eslint/no-explicit-any */
import { currentUser } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { z } from 'zod'

export async function POST(request: Request) {
  const bodySchema = z.object({
    content: z.string(),
    categoryId: z.string(),
  })
  const body = await request.json()
  const { content, categoryId } = bodySchema.parse(body)

  const user = await currentUser()

  if (!user?.id) {
    throw new Error('Usuário nao logado')
  }

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  })

  if (!category?.name) {
    throw NextResponse.json({ message: 'selecione uma categoria' })
  }

  const newTask = await prisma.task.create({
    data: {
      content,
      userId: user.id,
      categoryId: category.id,
    },
  })

  return NextResponse.json(newTask)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const categoryId = searchParams.get('categoryId')
    const user = await currentUser()

    if (!user?.id) {
      throw NextResponse.json({ message: 'usuário invalido' })
    }

    if (!categoryId) {
      throw NextResponse.json({ message: 'Categoria id está faltando' })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!category?.id) {
      throw NextResponse.json({ message: 'Categoria não existe' })
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        categoryId: category.id,
      },
    })

    return NextResponse.json(tasks)
  } catch (error: any) {
    throw NextResponse.json({ message: 'erro interno' })
  }
}
