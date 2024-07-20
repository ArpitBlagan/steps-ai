import another from "../images/another.png";
import hero from "../images/hero.png";
import mern from "../images/mern.png";
const Main = () => {
  return (
    <div>
      <div className="flex flex-col min-h-[80dvh] items-center justify-center gap-3 py-3 px-4 border rounded-xl my-3">
        <div className="relative w-full flex-1 md:block hidden">
          <img
            src={hero}
            height={400}
            width={530}
            className="rounded-xl absolute bottom-5 right-10"
          />
          <img
            src={another}
            height={400}
            width={530}
            className="rounded-xl absolute top-1 left-10 "
          />
        </div>
        <div>
          <p className="md:text-[30px] font-md text-center bg-gradient-to-r from-blue-600 via-red-500 to-indigo-400 inline-block text-transparent bg-clip-text">
            Welcome to MedManage, the ultimate solution for doctors to
            effortlessly manage their patient accounts, and ensure seamless
            medical record-keeping—all in one intuitive platform.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        <div className="h-[3dvh] text-xl text-gray-600">Quick Demo</div>
        <div className="h-[60dvh] flex items-center justify-center">
          <iframe
            src="https://www.loom.com/embed/2a43313b5fb342d4a3aad026f81b7df3?sid=e897e7f6-7a8f-4035-aeae-049578123c8c"
            className="md:h-[400px] h-[300px] w-full md:w-[700px] rounded-md"
          ></iframe>
        </div>
      </div>
      <div className="flex  flex-col md:flex-row justify-between gap-3 my-4 border rounded-xl py-3 px-4">
        <img src={mern} height={400} width={600} className="rounded-xl" />
        <div className="flex flex-col  w-full">
          <p className="text-xl">About Stack and Libraries Used</p>
          <div className="flex-1 flex items-center justify-center">
            <ul className="list-disc flex flex-col gap-3 py-2 px-7 text-gray-700">
              <li>MERN Stack: MongoDB, Express, React, Node.js</li>
              <li>TypeScript: Enhances JavaScript with static typing</li>
              <li>Zod: Type-safe schema validation</li>
              <li>AWS S3: Cloud storage for files</li>
              <li>React Hook Form: Efficient form handling in React</li>
              <li>
                Prisma: Modern ORM for database management with Postgres-SQL
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
