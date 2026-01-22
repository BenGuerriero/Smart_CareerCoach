import { JobCard as JobCardType } from '../types/chat';
import { Briefcase, TrendingUp } from 'lucide-react';

interface JobCardProps {
  job: JobCardType;
}

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50
                  backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6
                  hover:border-cyan-500/50 transition-all duration-300
                  hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105
                  animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                          flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
          </div>

          {job.matchScore !== undefined && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-full
                          bg-green-500/20 border border-green-500/30">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">{job.matchScore}%</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">{job.explanation}</p>
      </div>
    </div>
  );
};

interface JobCardsGridProps {
  jobs: JobCardType[];
}

export const JobCardsGrid = ({ jobs }: JobCardsGridProps) => {
  if (jobs.length === 0) return null;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-cyan-400" />
        Career Opportunities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};
