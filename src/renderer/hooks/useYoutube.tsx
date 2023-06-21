import axios from 'axios';
import { useState, useEffect } from 'react';
import usePrevious from './usePrevious';
import { SearchResult, Item } from 'renderer/types/SearchResult';
import { useQuery } from 'react-query';
const API_KEY = 'NOAPI';
const useYoutube = (term: string, fetchMore: boolean) => {
  const prevTerm = usePrevious(term);
  const [searchResult, setSearchResult] = useState<SearchResult | null>();
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    refetch();
  }, [fetchMore]);
  const { error, data, refetch } = useQuery<SearchResult>({
    enabled: false,
    queryKey: ['search', term, fetchMore],
    queryFn: async () => {
      let params: Record<string, any> = {
        part: 'snippet',
        q: term,
        maxResults: 5,
        key: API_KEY,
      };
      if (searchResult && prevTerm == term) {
        params['pageToken'] = searchResult.nextPageToken;
      }
      const localDat = (
        await axios.get(`https://youtube.googleapis.com/youtube/v3/search`, {
          params,
        })
      ).data;

      if (localDat) {
        setSearchResult(localDat);
        if (prevTerm === term) {
          console.log(prevTerm, term);
          setItems([...items, ...localDat.items]);
        } else {
          setItems([...localDat.items]);
        }
      }
      return localDat;
    },
  });

  return [searchResult, items, error] as [SearchResult, Item[], any];
};
export default useYoutube;
