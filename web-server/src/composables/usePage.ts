
export async function usePage<T = any> (routePath: string) {
  try {
    let reslut = await useHttpProxy<T>(`/api/uc/channel/page${routePath}`)
    return reslut?.data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
    }
  }
}