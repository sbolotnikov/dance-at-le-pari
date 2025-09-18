'use server';

import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { BaseMessage } from "@langchain/core/messages";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from '@langchain/pinecone';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";


// import fs from 'fs';
// import path from 'path';

export const makeChain = async (chat_history: BaseMessage[], input: string) => {
  // Load and process the document
  // const filePath = path.join(process.cwd(), "public", "knowledgebase.txt");
  // const fetchResponse = fs.readFileSync(filePath, 'utf8');
  // const text = fs.readFileSync(path.join(process.cwd(), "public", "knowledgebase.txt"), 'utf8');




//  const text =`
//  Dance at Le Pari is located at 34 South Ave. in Fanwood. Dance center is open for community of Fanwood and nearby area residents to explore the beautiful art of ballroom dancing, to meet each other and spend time together within family, friends and community.
// Name “Le Pari” symbolizes love for ballroom dancing as the city of Paris symbolizes love and romance throughout the world. “Le Pari” is the place uniting everyone who loves to dance.
// Our beautiful venue has large oak sprung wood floors over 4,000 sq. feet with recessed lightning, large sitting area, built-in sound system, separate practice studios, large screen projection television, kitchen area and much more. Dance at Le Pari has qualified experienced instructors much to offer for Fanwood and the surrounding areas!
// Dance at Le Pari's goal is to develop friendships and relatedness, promote health and fitness, and reach out to a diverse group of Fanwood residents by introducing them to the possibilities of Ballroom Dancing. “Le Pari” would like to present Fanwood community with quality and fun dance instruction, entertaining social dance events, and community building service projects. Owner, Paul Horvath an amateur dancer himself, said, “Ballroom dancing has a way of bringing people together.” “Dancing is this art form that involves everyone, whether you’re young, old, small or tall,” he said.
// As Paul describes the mission of “Dance at Le Pari” is to show love and warmth towards each person that we meet here…He said: “We welcome diversity of all kinds! Le Pari is the place where everything (status, job, money, nationality, etc.) is put aside and people are united by their passion to dance. Le Pari is the place to meet new friends and have fun together.”
// So what can the community of Fanwood can expect from this magnificent venue?
// Many things such as:
// Socials: offered to everyone, beginners and/or advanced ballroom/latin dancers where people can enjoy DJ hosted parties in a welcoming atmosphere. Please check our calendar for all social events.
// Group and Private classes: for someone to advance or start from beginning learning the art of ballroom dancing.
// Wedding and other special event instructions:for couples soon to be married a choreographed routine to their song of choice to perform on the most important day of their life. First Dance!
// Zumba and fitness exercises: offered to provide recreational and fitness exercises to community to stay fit.
// SO START NOW! DON'T WAIT! CONTACT US!

// Our Hours
// Monday: 11 am - 9 pm
// Tuesday: 1 pm - 9 pm
// Wednesday: 2 pm-9 pm
// Thursday: 11 pm-9 pm
// Friday: closed for private lessons. open for floor fee.
// Saturday: 1 pm-10.30 pm ( occasionally 11:00 pm)
// Sunday: 11 am - 9 pm
// Please note that the studio is opened earlier if private lessons are in session. Please give us a call at 848-244-0512 (or text) if you would like to come at different time than our hours of operation.
// Our Hours of Operation had been changed. It is updated monthly. So please check on it regularly.
// ADDRESS:
// 34 South Avenue, Fanwood, NJ 07023
// PARKING:ample, free, back of the building (main entrance)
// PUBLIC TRANSPORTATION:Check www.njtransit.com
// CONTACT:lepari34@gmail.com / 848-244-0512
// Fanwood is a small city in Union County that happens to be close to Manhattan, NYC, center of high level dancing. LE PARI's prime location allows for easy access via other major freeways like the
// Garden State Parkway,
// Route 280,
// NJ Turnpike and
// Route 22.
// It's located in walking distance (10 min.) from Fanwood train station (1/4 mile) which provides service to Penn station in Newark, Hoboken Terminal or Penn station in Manhattan.
// The studio offers a warm and inviting feel with beautiful floating dance floor and superior sound system. The main ballroom boasts a large open space (75 feet by 40 feet) with cozy furniture, a large screen television and recessed lights with dimmers, while Studio A & B offers cozy private rooms for smaller to medium size groups. When the dancing heats up, the studio is ready to push cool air-conditioning backed by air-conditioning systems.
// Please note that LePari Dance Center is located just across the street of the kickboxing and pizza locations, next to William lift company and Exxon gas station.
// Our Professional Team:
// Paul Horvath-Owner. Paul is a self employed entrepreneur for 30 years. Worked all his life in sales business.Paul is a successful businessman who has an experience of managing different types of businesses. He is famous in his industry for creative and imaginary approach, as well as strong discipline and sales expertise. He also is a student learning how to dance so he is familiar with all ups and downs of every dance student.
// Arlene l-Manager. Arlene is absolutely "people" person. She makes everyone feel comfortable and confident. She is great working with wedding couples or beginners in dancing world being a great motivator!
// Andrej Hacke- Dance Instructor. Originally from Slovakia, Andrej started ballroom dancing when he was 8 years old and had been teaching already as a teenager. He was 4-time Slovak Latin Formation Champion and represented Slovakia at 3 World and European Championships. He was also finalist of many Latin competitions in Slovakia. After moving to the USA, he was competing with his wife Iveta in the Professional Smooth division. Andrej is teaching all four styles and has Amateur and Pro-Am students, who had won many prestigious competitions such as US Nationals, Ohio Star Ball, Embassy Ballroom, Millennium Dance Sport, Manhattan DanceSport and etc. He is a very dedicated teacher and helps his students to achieve their goals.
// Carolina Jaurena -Dance Instructor. Carolina Jaurena was bound at an early age to follow a desire to perform. She has been teaching and performing for over 10 years, the height of her professional career is marked by her role as a primary dancer in the feature film Random Hearts directed by Sidney Pollack. Throughout her career as a dancer and performer she has been part of performances including “Eternal Tango” with Hector del Curto, The Show “Tanguero”, “Tango! Soul and Heart” with the Choral Arts Society of Washington at Kennedy Center and the off-Broadway Show “Tango House” produced by Juan Fabbri. She has also performed several seasons at the Thalia Spanish Theater in New York. International workshops and performances include Canarias Tango in Spain, 100 anos de tango at the Solis Theater in Uruguay and in Germany she has performed at The Theaterhaus in Stuttgart the Alte Synagoge in Hechingen and has taught Workshops at Landesakademie in Ochsenhausen. She has been invited to teach and perform at several tango festivals including; Tango Norte Festival in Sweden, Yale Tango Fest, Tango Fest Houston and New Orleans Tango Festival. Carolina is a respected and sought-after performer and instructor she is renowned for her precision of movement, professionalism and charisma. Excellent in teaching Argentine Tango and Cardio Salsa.
// E J - Dance Instructor. Instructor EJ is specializing in American style: smooth and rhythm, also West Coast Swing and Hustle. But his personal favorite is Night Club two step. His method of teaching helps to move through process of learning how to dance with ease and grace. His personality makes you feel comfortable and relaxed. Check our calendar for group classes taught by EJ as well as don't hesitate to schedule private lesson with him!
// Heather Gehring - Dance Instructor. Originally from Vermont, began ballet training with her mother at age two. As a young dancer, she studied with Boston Ballet, School of American Ballet and Hartford Ballet, becoming a professional at age sixteen. Besides the stage, Heather has danced in movies (Enchanted, Little Manhattan), on TV (MTV, Gossip Girls, Today Show, Tony Danza Show, Boardwalk Empire) and in commercials. With her partner Lou Brockman, she has traveled the world teaching and performing their unique “Silver Screen Style” as well as performing their own choreography at many famous NYC venues including Town Hall, Carnegie Hall, The Rainbow Room, 54 Below and Birdland. They have taught and performed at Jacob’s Pillow and with Wynton Marsalis at Harvard University, at NYU and led a series on partner dancing in movies at the 92nd St. Y. For the past three years Heather has returned to her ballet roots and enjoyed coaching the professional dancers and performing as a guest artist with the Eglevsky Ballet Co. She is excited to bring her expertise and love of dance to the new Dance @ Le Pari!
// Iveta Hackeova - Dance Instructor. Originally from Slovakia, Iveta started to dance at the very early age. She was not only training, dancing, competing as a dancer but also started teaching when she was only 17 years old! In her home country, getting an experience teaching, she got highly trained in International style: Latin and Standard. She was 4-times Slovak Latin Formation Champion and represented Slovakia at World and European Championships multiple times. After moving to the USA, with her husband Andrej, she got trained in American Style to expand her teaching skills and dancer horizons. She fell in love with American Style and decided to compete in the Professional Smooth division with her husband. This transformation from International to American Style went quite successfully! Nowadays Iveta has a profound knowledge in all 4 styles and has many students that won many prestigious pro-am competitions such as US Nationals, Ohio Star Ball and others. She likes to help her students to achieve their goals with kindness, energy and patience! Book your lesson with her!
// Jamie - Dance Instructor. Jamie is a Morris County-based Ballroom and Latin dance teacher, choreographer and performer. Jamie has been involved in the Arts from an early age. Jamie has performed in numerous showcases and events and has had the pleasure of performing at various Latin venues in NJ with the world-renowned salsa team. Her most recent television appearance was NJ's 2017 Hispanic Youth Showcase. Excellent with beginners and expert in salsa and bachata.
// Jennifer Lynn - Dance Instructor. Jennifer is an American teacher with decades of experience (over 25 years!) training not only students, but also staff for many studios. With an ability to teach all dances and styles, she specializes in understanding each person’s learning style to assure an easy and fun lesson! Prior to becoming a teacher, she was a certified gymnastics coach. Jennifer started in gymnastics at the age of 7. She fell in love with the art of movement. She was a competitive gymnast, winning many competitions. When she encountered partner dancing, she was fascinated and switched her field from athletics to dance. She teaches American style, Club style and International style. She has danced in lots of pro-am competitions all over the country. She has performed in many shows, including New York Express. She is renowned for her contribution to Hustle, having won “Favorite Teacher” nationally for multiple years! Jennifer is truly a teacher at heart, taking great delight in passing on her knowledge and seeing her students enjoy the beautiful art of dancing! According to Jennifer, “there is nothing better than seeing the joy on a student’s face as they improve!”
// Lou Brockman - Dance Instructor. A Chicago native, began ballroom dancing when he was a young teen. He has lived in NYC for over two decades and has danced in films (Mona Lisa Smile, Disney’s “Enchanted”), and had featured performances on television (The Oprah Winfrey Show, Good Morning America, NBC’s Today Show, Michael Feinstein’s American Songbook, Boardwalk Empire), and on stages around the world (The Kennedy Center, Joyce Theater, Jacob’s Pillow) Lou was a member of the acclaimed American Ballroom Theater and is a highly respected choreographer who has taught master classes at Harvard University and NYU. He and Heather guest starred with Michael Feinstein in his tribute to MGM musicals at Carnegie Hall.
// Sergey Bolotnikov - Dance Instructor, Fitness Coach, Dance Host. Serge is a retired competitive dancer, who is actively competes with his students in numerous competitions. He holds certificates for all 4 styles of dancing: international and american styles. He is also gyrotonic instructor and combines the fitness aspect with dancing experience. He started in the age of 9 in Russia and was representing Russia in many youth and adults divisions in Ballroom and Latin competitions. He also is very creative in showdances and loves to create a choreography for student showcase events. He takes pride in teaching and wants to see his students to succeed!
// Taylor Beattie - Dance Instructor. Taylor has been dancing since she was 3 years old and has not stopped since then. She has trained in a variety of styles from ballet, jazz, tap to ballroom and a number of others in between. Even though she has been working with children on and off since she was thirteen, it wasn’t until four years ago that she made that choice permanent. She has taught children as young as two to as old as sixteen and loves every second of working with them! Currently Taylor is working as a dance teacher for children ages two to six for basic ballet, tap and jazz moves. She starts a new Kids program at Le Pari in 2022 teaching not only ballet up to 8 years old but also Ballroom and Latin to children up to 12 years old. Even her current focus is on the kids’ program, she also is certified in smooth, rhythm and Latin style dances specializing in teaching beginners in adult division. She has an experience of teaching group classes for a variety of ages. Sign your kids up for our new kids’ program with LP very experienced teacher, Taylor!

// Gift Certificates
// $50 Gift Certificate - costs $52, $100 Gift Certificate - costs $104.
// Give the gift of dance with a Dance at le Pari gift certificate! Perfect for any occasion, our gift certificates allow your loved ones to experience the joy and elegance of ballroom dancing. Whether they're complete beginners or experienced dancers looking to refine their skills, recipients can choose from our wide range of classes, including waltz, tango, foxtrot, and more.
// Gift certificates are available in various denominations and can be applied to group classes, private lessons, or dance parties. Surprise someone special with the opportunity to learn new moves, boost their confidence, and have fun in our welcoming studio environment.
// A Dance at le Pari gift certificate is more than just a present – it's an invitation to a world of rhythm, grace, and unforgettable memories.

// Private IN-STUDIO lessons packages: Check with us PRIOR to scheduling for instructor availability.
// 1 Private Dance Lesson 1 - 45 minute lesson $115 ($118 inc cc fee) 
// 5 - 45 minute lesson package $550 ($566 inc cc fee)
// 12 - 45 minute lesson package $1260 ($1298 inc cc fee)
// 24 - 45 minute lesson package $2400 ($2472 inc cc fee)
// 36 - 45 minute lesson package $3420 ($3522 inc cc fee)
// Private IN-STUDIO wedding dance lessons packages:Our skilled instructors will be certain to have you wow your guests with a choreographed first dance to the song of your choice. Check with us PRIOR to scheduling for instructor availability
// 1 Wedding Dance Lesson 1 - 45 minute lesson $100 ($103 inc cc fee)
// 5 - 45 minute wedding lesson package $475 ($25 savings) ($489 inc cc fee)
// 10 - 45 minute wedding lesson package $ 925 (savings $75) ($953 inc cc fee).

// For our Group classes please visit: https://leparidancecenter.com/dancing/group_classes

// For Dance socials/ Party please visit: https://leparidancecenter.com/dancing/parties

// Floor Fee (60 min) Main floor
// 1 hour $20 (online prices include cc fee $21). Includes setting up & cleaning. Non-refundable. No more than 2 pp.
// Floor Fee (60 min) Studio A (Front room)
// 1 hour $25 (online prices include cc fee $26). Includes setting up & cleaning. Non-refundable. Price covers up to 3 people. $4 each additional person. 12 person limit
// Floor Fee (60 min) Studio B (Back room)
// 1 hour $20 (online prices include cc fee $21). Includes setting up & cleaning. Non-refundable. Price includes up to 3 people. $4 additional per person. 8 person limit


// Terms & Conditions of Le Pari Dance Fitness Center
// By purchasing any of our services online or inside of Le Pari Dance Center,
// the client agrees to the following:
// Group classes:
// 1. Le Pari has a right to cancel any group class with less than 6 students in the class.
// 2. If the class is missed by a student, the payment cannot be credited or transferred to the next
// week.
// 3. The group class is for 45 minutes long.
// 4. No refunds on any group classes payments.
// Private/Wedding lessons:
// 1. All payments should be received in advance. If the payment is not received, the lesson is
// not confirmed with the instructor & considered cancelled.
// 2. Each lesson is 45 minutes long and includes the setup of the schedule with instructor or any
// other questions discussed.
// 3. The studio agrees to give dance instructions in accordance with
// the Le Pari Fitness Dance Center methods and steps and to make its facilities and personnel
// available to the student for such purpose, which course shall be completed within one year
// of the date of the purchase except one lesson with 3 months and 5 lessons package
// with 5 months of expiration. The terms and conditions of this contract remain the same
// on the purchase of a new dance program by abovementioned student and it doesn’t require
// to resign the contract each time.
//  4. It is further agreed that all lessons shall be scheduled for definite times within the above
// term, and if the student wishes to cancel or change any appointment for instruction, he shall notify
// the studio at least 24 hours in advance of the appointed time. Failure or neglect of the student to
// give such prior notice shall cause such lesson to be charged to the students' account with the same
// effect as of the lesson had been used.
//  5. It is further understood and agreed that a reduced rate of any dance package has been
// given to the student because of the number of hours contracted for, and that this contract is entire
// and is not severable and divisible. If the student has a significant reason to terminate his contract,
// he needs to provide Le Pari center with the written proof of the unavailability on taking lessons.
// If the package has been agreed on 3 payments plan with the discounted rate, at the termination of
// the contract the student is obliged to pay additional amount for the used lessons with the rate per
// one single lesson. If such payment doesn’t occur, Le Pari Center has a right to contact the
// appropriate agencies to receive the owned amount.
//  6. It is also understood and agreed to that this contract is made solely with the above studio as
// seller and does not constitute any agreement with any instructor. If the student continues with any
// Le Pari dance program, all terms and conditions of this contract remains the same.
//  7. There is reserved unto the students, the right to cancel private lessons contract within seventy
// - two (72) hours of the date of the purchase, and shall be binding thereafter if not cancelled. There
// will be 7% administrative fee charged on such a refund. It’s noted that all lessons program has
// terms of expiration. If the package is not used within expiration term, it is considered to be
// cancelled.

// Rentals (Floor fee):
// 1. The rental fee includes the time for setting up & cleaning.
// 2. The payment should be done in advance.
// 3. The renter is responsible for any damages if they occurred on the rented premises.
// 4. Le Pari is not responsible for any lost items.

// visit our studio calendar: https://leparidancecenter.com/calendar
// our blog: https://leparidancecenter.com/blog/0

// WEDDING / SPECIAL EVENT DANCE LESSONS
// Dance at Le Pari located in Fanwood NJ is a ballroom dance studio that specializes in wedding dance instruction.
// Our professional dance instructors will help you create the perfect dance to the song of your choice for your momentous day!
// Whether you're gliding across the floor in a graceful waltz or twirling in the arms of your beloved, our studio is where magic happens. Imagine the soft strains of music, the warmth of each other's touch, and the promise of forever woven into every step. Here, we don't just teach dance; we choreograph your love story. So, let's sway, spin, and create memories that will last a lifetime. Are you ready to dance your way into forever?
// Our skilled instructors will also choreograph dances for parents, bridesmaids, groomsmen, father-daughter or mother-son dances! Join our dance program and begin your happily ever after today!

// When To Start Taking Wedding Dance Lessons. How Many Lessons I need?
// When to start taking wedding dance lessons is an important consideration for couples preparing for their big day. Let’s break it down:
// Early Start: Starting wedding dance lessons sooner rather than later is advisable. If you begin early, you’ll have time to learn the dance, practice, and build confidence. You can then continue practicing on your own. However, waiting until the last minute can be risky—you might run out of time before the wedding.
// Dance Complexity: Consider how involved you want your dance to be:
// Basic Step: If you’re aiming for a simple dance, just learning the basic step that matches your chosen music can be accomplished in as little as one lesson. It may take a few more lessons to feel comfortable.
// Variations: To add some flair, learn variations like turns, twinkles, and walk-arounds. These can be sprinkled throughout your dance. Loose choreography with variations typically takes 2 to 5 lessons.
// Special Entrance and Pose: For a more elaborate dance, choreograph a special entrance, intersperse variations, and end with a final pose or dip. This semi-choreographed format usually requires 3 to 8 lessons.
// Fully Choreographed Routine: If you want a fully choreographed wedding dance routine, where every step is planned from start to finish, the number of lessons can vary:
// Minimum: At least 10 lessons are needed to learn a full routine.
// Realistic Range: The average is 15 to 25 lessons.
// Complex Routines: Some couples invest up to 50 hours into a complex routine.
// Timeframe:
// Weekly Lessons: Most people take one lesson per week.
// Recommendations:
// Basic Dance: A few weeks.
// Loose Choreography: Three to six weeks.
// Semi-Choreographed Dance: One to three months.
// Fully Choreographed Routine: Six months or more.
// Adjustments: If you take more than one lesson per week, adjust the timeframes accordingly.
// Remember, starting early allows you to enjoy the process, build confidence, and create a memorable dance for your special day. So don’t wait— get started on your wedding dance today!

// Why Take Wedding Dance Lessons?
// Celebrate Love:
// Wedding dances are more than just steps; they're a celebration of love. Imagine swaying gracefully with your partner, surrounded by twinkling lights, as your hearts beat in sync. 💖
// Confidence Boost:
// Navigating the dance floor can be nerve-wracking. But fear not! Our expert instructors will transform you from two left feet to a confident dancer.
// Personalized Choreography:
// Your love story is unique, and so should be your dance. We tailor choreography to your personalities, song choice, and comfort level. Whether it's a waltz, salsa, or a quirky mashup, we've got you covered. 🌟
// Memorable Moments:
// Picture this: your guests' eyes widen as you twirl, dip, and spin. The applause swells, and your love story unfolds on the dance floor. These moments become cherished memories that last a lifetime.

// for wedding dance, song and other recommendations visit https://leparidancecenter.com/weddings and https://leparidancecenter.com/blog/weddings
// To subscribe to our newsletter, please visit https://leparidancecenter.com/subscribeemaillist.`;

  // const splitter = new RecursiveCharacterTextSplitter({
  //   chunkSize: 1536,
  // });

  // const documents = await splitter.createDocuments([text]);
   // Create the vector store
  // const vectorstore = await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings({
  //   model: "text-embedding-3-small",
  //   }), {
  //   pineconeIndex,
  // });
  const pineconeIndex = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  }).Index(process.env.PINECONE_INDEX!);
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    });
  const vectorstore = await PineconeStore.fromExistingIndex(embeddings, {pineconeIndex,maxConcurrency: 5,});
  const retriever = vectorstore.asRetriever();

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-1106',
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
  });

  // Contextualize question
  const contextualizeQSystemPrompt = `
Given a chat history and the latest user question
which might reference context in the chat history,
formulate a standalone question which can be understood
without the chat history. Do NOT answer the question, just
reformulate it if needed and otherwise return it as is.`;

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm,
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

  // Answer question
  const qaSystemPrompt = `
You are an assistant for question-answering tasks. Use
the following pieces of retrieved context to answer the
question. If you don't know the answer, just say that you
don't know. Use three sentences maximum and keep the answer
concise.

{context}`;

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
  });

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });

  // Execute the RAG chain
  const response = await ragChain.invoke({
    chat_history,
    input,
  });

  return response.answer;
};



export const updateRAG = async (text:string) => {
  const pineconeIndex = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  }).Index(process.env.PINECONE_INDEX!);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1536,
  });

  const documents = await splitter.createDocuments([text]);
 
  await pineconeIndex.deleteAll();  
  
  
    const vectorstore = await PineconeStore.fromDocuments(documents, new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    }), {
    pineconeIndex,
  });


}






const cache = new Map<string, any>();

export const makeChainDJ = async (chat_history: BaseMessage[],addToSystemPrompt:string, input: string) => {
  const cacheKey = JSON.stringify({ chat_history, addToSystemPrompt, input });

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const llm = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-1106',
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
  });

  const djSystemPrompt = `
You are a DJ at a dance party. Your name is DJ LePari .
You are playing music and interacting with the crowd.
You should be energetic, and fun. Your first message should be an introduction of yourself and welcome message to the party. 
If you know theme of the party, mention it, also you should refer to party theme thru out all party messages, but in creative and engaging ways. Do not repeate theme name often. You can mention the venue Dance At Le Pari Dance Studio in interesting funny not repeatitive ways. Use play of words.
Keep your responses short and engaging. Do not to repeat yourself and use different and creative ways to vary the beginning of your messages. Check the chat history to avoid repeating yourself.
You would be provided the name of the song and artist and dance name. Some times name has extra words and numbers. Do not use them. You need to come up with introduction to dance, song and mention song following, 
that also would be included in message to you. 
You can also talk about dancing and party theme.
`+addToSystemPrompt;

  const djPrompt = ChatPromptTemplate.fromMessages([
    ["system", djSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const chain = djPrompt.pipe(llm);

  const response = await chain.invoke({
    chat_history,
    input,
  });

  cache.set(cacheKey, response.content);


  return response.content;
};

