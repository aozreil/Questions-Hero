import ExpandableSearch from "~/components/UI/ExpandableSearch";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData } from "react-router";


export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("term");
  if(!query){
    return []
  }
  console.log(query)
  return [];
}


export default function SearchPage() {
  const data = useLoaderData();
  console.log(data)
  return (
    <section className="container text-[#070707] text-center">
      <h4 className="text-[38px] font-medium">Unlocking Knowledge, Guiding Futures:</h4>
      <h3 className="text-[56px] font-bold">Your Ultimate University Resource Hub!</h3>
      <ExpandableSearch />
    </section>
  );
}