
export async function useSetting<T = any> (url: string) {
  try {
    let reslut = await useHttpProxy<T>('/api/uc/account')
    return reslut
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
    }
  }
}