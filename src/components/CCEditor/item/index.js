import registerNode from './topo-node';
import registerEdge from './edge';

export default function(G6) {
  registerNode(G6);
  registerEdge(G6);
}
