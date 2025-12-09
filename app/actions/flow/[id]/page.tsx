import Flow from "@/components/flow/flow"

interface FlowPageProps {
  params: Promise<{ id: string }>
}

export default async function FlowPage({ params }: FlowPageProps) {
  const { id } = await params

  return <Flow />
}
