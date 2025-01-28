// page.tsx
import { PageWrapper } from '@/components/page-wrapper';
import BannerGallery from '@/components/BannerGallery';
import ClientSideContent from '@/components/ClientSideContent';
import { prisma } from '@/lib/prisma';
import { TBannerEvent } from '@/types/screen-settings';
export default async function Home() {
  // Fetch data server-side
  const settings = await prisma.settingVar.findUnique({
    where: {
      id: 0,
    },
  });

  let dt = new Date();
  const dateString = dt.toISOString().split('T')[0] + 'T' + dt.toLocaleString('es-CL').split(" ")[1].slice(0, -3);
  
  const eventsArray = await prisma.event.findMany({
    where: {
      templateID: { in: settings!.front_templates_ids },
      date: { gt: dateString }
    },
    include: {
      template: true,
    }
  });

  eventsArray.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
  
  let events1 = [];
  for (let i = 0; i < settings!.front_templates_ids.length; i++) {
    if (eventsArray.filter(item => item.templateID == settings!.front_templates_ids[i])[0] != undefined)
      events1.push(eventsArray.filter(item => item.templateID == settings!.front_templates_ids[i])[0]);
  }
  const events2=events1.map((event)=>{return{date:event.date, eventtype:event.eventtype as string, id:event.id, image:event.image?event.image:"", tag:event.tag}})
  const events : TBannerEvent[] = [{
    date: '',
    tag: 'Give a Gift of Dance!',
    id: '/gift',
    image: '/images/giftcertificate.jpg',
    eventtype: '',
  },
  {
    date: '',
    tag: 'Subscribe to our Newsletter!',
    id: '/subscribeemaillist',
    image: '/images/gotmail.jpg',
    eventtype: '',
  },
  ...events2];

  return (
    <PageWrapper className="absolute inset-0 flex flex-col justify-start items-center mt-10 md:mt-20 ">
      <div className="w-full h-1/5 relative overflow-auto rounded-md">
        {events && <BannerGallery events={events} seconds={7} />}
      </div>
      <ClientSideContent />
    </PageWrapper>
  );
}

export const dynamic = 'auto';