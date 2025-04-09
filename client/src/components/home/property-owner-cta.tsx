import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook

export default function PropertyOwnerCTA() {
  const { user } = useAuth(); // Get user from useAuth hook

  return (
    <section className="py-8 border-b">
      <div className="container mx-auto px-4 pt-20">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 mt-14">
            <div className="border-t border-gray-800 flex-grow w-1/5"></div>
            <h2 className="text-xl font-normal text-gray-900 mx-4">
              <span className="text-xl max-sm:text-xs max-sm:text-[10px]">
                Sell your Property
              </span>{" "}
              <span className="font-['Dancing_Script',_cursive] text-[30px] max-sm:text-[20px] italic text-[#bb1824] inline-block relative">
                Super Fast
                <span className="absolute bottom-[-5px] left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#bb1824] to-[#bb1824] after:content-[''] after:absolute after:right-[-5px] after:bottom-[-5px] after:border-t-[6px] after:border-r-[0px] after:border-b-[0px] after:border-l-[10px] after:border-t-transparent after:border-l-[#bb1824]"></span>
              </span>
            </h2>
            <div className="border-t border-gray-800 flex-grow w-1/5"></div>
          </div>
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-blue-800 hover:bg-blue-800"
          >
            <Link
              href={user ? "/post-property-free" : "/auth"}
              onClick={() => {
                window.scrollTo(0, 0);
                if (!user) {
                  toast({
                    title: "Login Required",
                    description: "You need to login before posting a property.",
                    variant: "default",
                  });
                }
              }}
              className="inline-flex bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Post Property FREE
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
