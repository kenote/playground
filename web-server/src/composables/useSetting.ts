
export async function useSetting<T = any> (url: string) {
  try {
    let reslut = await useHttpProxy<T>(url, { interceptor: true })
    return reslut?.data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
    }
  }
}