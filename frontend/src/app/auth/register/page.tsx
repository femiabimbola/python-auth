import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Make sure you create these image assets or replace src with placeholders
// import jobSeekerImg from "@/public/job-seeker.png";
// import employerImg from "@/public/employer.png";

export default function RegistrationSelectionPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Choose the account that best describes you.
          </h1>
          <p className="text-gray-500">
            Join our platform to find your next opportunity or hire top talent.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Job Seeker Card */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-64 w-full bg-gray-200">
               {/* Replace with your actual image path */}
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                alt="Job Seeker"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="grow p-6 space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                I'm looking for a job
              </h2>
              <p className="text-gray-600">
                Discover opportunities and apply to jobs.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href="/applicant/register" className="w-full">
                <Button 
                  className="w-full bg-[#E2E8F0] hover:bg-gray-300 text-gray-900 font-medium h-12 rounded-full transition-colors"
                  variant="secondary"
                >
                  Sign up as a Job Seeker
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Employer Card */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="relative h-64 w-full bg-gray-200">
               {/* Replace with your actual image path */}
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop"
                alt="Employer"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="grow p-6 space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                I'm hiring
              </h2>
              <p className="text-gray-600">
                Find candidates and manage recruitment.
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href="/employer/register" className="w-full">
                <Button 
                  className="w-full bg-[#E2E8F0] hover:bg-gray-300 text-gray-900 font-medium h-12 rounded-full transition-colors"
                  variant="secondary"
                >
                  Sign up as an Employer
                </Button>
              </Link>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}