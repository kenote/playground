


export async function useVerifyTicket<T = any> (ticket: string, name: string, type: string) {
  try {
    let reslut = await useHttpProxy<T>('/api/uc/ticket/verify', {
      method: 'PUT',
      data: { ticket, name, type }
    })
    return reslut
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
    }
  }
}